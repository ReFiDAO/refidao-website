#!/usr/bin/env python3
"""
Ghost to WordPress WXR XML Converter

Converts Ghost JSON export to WordPress WXR (WordPress eXtended RSS) XML format.
This format is widely supported and can be imported into WordPress and many other CMS platforms.
"""

import json
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime
from html import escape
import sys
import os
import re


def parse_ghost_date(ghost_date_str):
    """Convert Ghost ISO 8601 date to WordPress format (YYYY-MM-DD HH:MM:SS)"""
    if not ghost_date_str:
        return None
    
    try:
        # Parse ISO 8601 format: 2022-01-03T10:49:38.000Z
        dt = datetime.fromisoformat(ghost_date_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception as e:
        print(f"Warning: Could not parse date '{ghost_date_str}': {e}", file=sys.stderr)
        return None


def format_rss_date(dt_str):
    """Convert WordPress date format to RFC 822 format for RSS pubDate"""
    if not dt_str:
        return None
    
    try:
        dt = datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
        # Format as RFC 822: Mon, 03 Jan 2022 10:49:38 +0000
        return dt.strftime('%a, %d %b %Y %H:%M:%S +0000')
    except Exception:
        return None


def get_post_content(post):
    """Extract HTML content from Ghost post, preferring html field over mobiledoc"""
    # Prefer HTML if available
    if post.get('html'):
        return post['html']
    
    # Fallback to plaintext if HTML not available
    if post.get('plaintext'):
        return f"<p>{escape(post['plaintext'])}</p>"
    
    return ""


def build_lookup_dicts(data):
    """Build lookup dictionaries for efficient relationship resolution"""
    # Author lookup
    authors = {author['id']: author for author in data.get('users', [])}
    
    # Tag lookup
    tags = {tag['id']: tag for tag in data.get('tags', [])}
    
    # Post-author relationships
    post_authors = {}
    for pa in data.get('posts_authors', []):
        post_id = pa.get('post_id')
        author_id = pa.get('author_id')
        if post_id and author_id:
            if post_id not in post_authors:
                post_authors[post_id] = []
            post_authors[post_id].append(author_id)
    
    # Post-tag relationships
    post_tags = {}
    for pt in data.get('posts_tags', []):
        post_id = pt.get('post_id')
        tag_id = pt.get('tag_id')
        if post_id and tag_id:
            if post_id not in post_tags:
                post_tags[post_id] = []
            post_tags[post_id].append(tag_id)
    
    # Post metadata lookup
    post_meta = {}
    for pm in data.get('posts_meta', []):
        post_id = pm.get('post_id')
        if post_id:
            if post_id not in post_meta:
                post_meta[post_id] = []
            post_meta[post_id].append(pm)
    
    return authors, tags, post_authors, post_tags, post_meta


def create_wxr_xml(ghost_data, output_file):
    """Convert Ghost JSON export to WordPress WXR XML format"""
    
    # Extract data
    db = ghost_data['db'][0]
    data = db['data']
    meta = db.get('meta', {})
    
    # Get site settings
    settings = {s['key']: s['value'] for s in data.get('settings', [])}
    site_title = settings.get('title', 'Ghost Export')
    site_description = settings.get('description', '')
    site_url = settings.get('url', 'https://example.com')
    
    # Build lookup dictionaries
    authors, tags, post_authors, post_tags, post_meta = build_lookup_dicts(data)
    
    # Create root RSS element
    rss = ET.Element('rss', {
        'version': '2.0',
        'xmlns:excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
        'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:wp': 'http://wordpress.org/export/1.2/'
    })
    
    # Create channel element
    channel = ET.SubElement(rss, 'channel')
    
    # Channel metadata
    ET.SubElement(channel, 'title').text = site_title
    ET.SubElement(channel, 'link').text = site_url
    ET.SubElement(channel, 'description').text = site_description
    ET.SubElement(channel, 'pubDate').text = datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000')
    ET.SubElement(channel, 'language').text = settings.get('locale', 'en')
    ET.SubElement(channel, 'wp:wxr_version').text = '1.2'
    ET.SubElement(channel, 'wp:base_site_url').text = site_url
    ET.SubElement(channel, 'wp:base_blog_url').text = site_url
    
    # Add conversion metadata as comment
    comment = ET.Comment(f' Converted from Ghost export on {datetime.now().isoformat()} | Ghost version: {meta.get("version", "unknown")} ')
    channel.append(comment)
    
    # Add authors
    author_ids_used = set()
    for post in data.get('posts', []):
        post_id = post.get('id')
        if post_id and post_id in post_authors:
            for author_id in post_authors[post_id]:
                author_ids_used.add(author_id)
    
    for author_id in author_ids_used:
        if author_id in authors:
            author = authors[author_id]
            wp_author = ET.SubElement(channel, 'wp:author')
            ET.SubElement(wp_author, 'wp:author_id').text = author_id
            ET.SubElement(wp_author, 'wp:author_login').text = author.get('slug', author.get('name', '').lower().replace(' ', ''))
            ET.SubElement(wp_author, 'wp:author_email').text = author.get('email', '')
            ET.SubElement(wp_author, 'wp:author_display_name').text = author.get('name', '')
            ET.SubElement(wp_author, 'wp:author_first_name').text = ''
            ET.SubElement(wp_author, 'wp:author_last_name').text = ''
    
    # Process posts
    posts_processed = 0
    for post in data.get('posts', []):
        post_id = post.get('id')
        if not post_id:
            continue
        
        # Create item element
        item = ET.SubElement(channel, 'item')
        
        # Basic post information
        title = post.get('title', 'Untitled')
        ET.SubElement(item, 'title').text = title
        
        slug = post.get('slug', '')
        post_url = f"{site_url}/{slug}/" if slug else site_url
        ET.SubElement(item, 'link').text = post_url
        ET.SubElement(item, 'guid', {'isPermaLink': 'false'}).text = post.get('uuid', post_id)
        
        # Publication date
        published_at = post.get('published_at')
        if published_at:
            wp_date = parse_ghost_date(published_at)
            if wp_date:
                ET.SubElement(item, 'pubDate').text = format_rss_date(wp_date) or wp_date
                ET.SubElement(item, 'wp:post_date').text = wp_date
                ET.SubElement(item, 'wp:post_date_gmt').text = wp_date
        else:
            created_at = post.get('created_at')
            if created_at:
                wp_date = parse_ghost_date(created_at)
                if wp_date:
                    ET.SubElement(item, 'pubDate').text = format_rss_date(wp_date) or wp_date
                    ET.SubElement(item, 'wp:post_date').text = wp_date
                    ET.SubElement(item, 'wp:post_date_gmt').text = wp_date
        
        # Post type and status
        post_type = post.get('type', 'post')
        ET.SubElement(item, 'wp:post_type').text = post_type
        
        status = post.get('status', 'draft')
        wp_status = 'publish' if status == 'published' else 'draft'
        ET.SubElement(item, 'wp:post_status').text = wp_status
        
        # Post ID and name (slug)
        ET.SubElement(item, 'wp:post_id').text = post_id
        ET.SubElement(item, 'wp:post_name').text = slug
        ET.SubElement(item, 'wp:post_parent').text = '0'
        ET.SubElement(item, 'wp:menu_order').text = '0'
        ET.SubElement(item, 'wp:post_password').text = ''
        ET.SubElement(item, 'wp:is_sticky').text = '1' if post.get('featured') else '0'
        
        # Authors (creators)
        if post_id in post_authors:
            for author_id in post_authors[post_id]:
                if author_id in authors:
                    author = authors[author_id]
                    ET.SubElement(item, 'dc:creator').text = author.get('name', '')
        
        # Content (mark for CDATA wrapping)
        content = get_post_content(post)
        if content:
            content_elem = ET.SubElement(item, 'content:encoded')
            content_elem.text = content
            content_elem.set('_cdata', 'true')  # Mark for CDATA
        
        # Excerpt (mark for CDATA wrapping)
        excerpt = post.get('custom_excerpt') or (post.get('plaintext') or '')[:300]
        if excerpt:
            excerpt_elem = ET.SubElement(item, 'excerpt:encoded')
            excerpt_elem.text = excerpt
            excerpt_elem.set('_cdata', 'true')  # Mark for CDATA
        
        # Tags (categories)
        if post_id in post_tags:
            for tag_id in post_tags[post_id]:
                if tag_id in tags:
                    tag = tags[tag_id]
                    category = ET.SubElement(item, 'category', {
                        'domain': 'post_tag',
                        'nicename': tag.get('slug', '')
                    })
                    category.text = tag.get('name', '')
        
        # Featured image (as postmeta)
        feature_image = post.get('feature_image')
        if feature_image:
            meta_elem = ET.SubElement(item, 'wp:postmeta')
            ET.SubElement(meta_elem, 'wp:meta_key').text = '_thumbnail_id'
            ET.SubElement(meta_elem, 'wp:meta_value').text = feature_image
        
        # Additional post metadata
        if post_id in post_meta:
            for meta_item in post_meta[post_id]:
                meta_key = meta_item.get('key')
                meta_value = meta_item.get('value')
                if meta_key and meta_value:
                    meta_elem = ET.SubElement(item, 'wp:postmeta')
                    ET.SubElement(meta_elem, 'wp:meta_key').text = meta_key
                    ET.SubElement(meta_elem, 'wp:meta_value').text = str(meta_value)
        
        # Visibility handling
        visibility = post.get('visibility', 'public')
        if visibility != 'public':
            meta_elem = ET.SubElement(item, 'wp:postmeta')
            ET.SubElement(meta_elem, 'wp:meta_key').text = 'ghost_visibility'
            ET.SubElement(meta_elem, 'wp:meta_value').text = visibility
        
        posts_processed += 1
    
    # Serialize XML and post-process for CDATA sections
    xml_str = ET.tostring(rss, encoding='unicode', method='xml')
    
    # Post-process to add CDATA sections
    # Find content:encoded and excerpt:encoded elements and wrap their content in CDATA
    def add_cdata(match):
        tag_name = match.group(1)
        content = match.group(2)
        # Escape any existing CDATA markers in content
        content = content.replace(']]>', ']]&gt;')
        return f'<{tag_name}><![CDATA[{content}]]></{tag_name}>'
    
    # Match elements that were marked for CDATA
    xml_str = re.sub(
        r'<(content:encoded|excerpt:encoded) _cdata="true">(.*?)</\1>',
        add_cdata,
        xml_str,
        flags=re.DOTALL
    )
    
    # Parse and pretty-print
    try:
        dom = minidom.parseString(xml_str)
        pretty_xml = dom.toprettyxml(indent='  ', encoding='utf-8')
        
        # Remove extra blank lines
        lines = pretty_xml.decode('utf-8').split('\n')
        filtered_lines = []
        prev_empty = False
        for line in lines:
            is_empty = not line.strip()
            if not (is_empty and prev_empty):
                filtered_lines.append(line)
            prev_empty = is_empty
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(filtered_lines))
    except Exception as e:
        # Fallback: write directly if parsing fails
        print(f"Warning: Could not pretty-print XML: {e}", file=sys.stderr)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
            f.write(xml_str)
    
    # Print statistics
    print(f"Conversion complete!")
    print(f"  Posts processed: {posts_processed}")
    print(f"  Authors: {len(author_ids_used)}")
    print(f"  Tags: {len(tags)}")
    print(f"  Output file: {output_file}")
    
    return posts_processed


def main():
    """Main conversion function"""
    if len(sys.argv) < 2:
        input_file = 'ReFi DAO Nov 18 2025.json'
    else:
        input_file = sys.argv[1]
    
    if len(sys.argv) < 3:
        output_file = 'wordpress-export.xml'
    else:
        output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.", file=sys.stderr)
        sys.exit(1)
    
    print(f"Reading Ghost export from: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            ghost_data = json.load(f)
        
        print(f"Converting to WordPress WXR format...")
        posts_count = create_wxr_xml(ghost_data, output_file)
        
        print(f"\nSuccess! Converted {posts_count} posts to {output_file}")
        
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()

